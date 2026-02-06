import { Injectable } from '@angular/core';
import { ApsService } from './aps.service';

declare const Autodesk: any;

@Injectable({ providedIn: 'root' })
export class ViewerService {
  constructor(private aps: ApsService) {}

  initViewer(container: HTMLElement): Promise<any> {
    return new Promise((resolve, reject) => {
      this.aps.getAccessToken().subscribe({
        next: (token) => {
          Autodesk.Viewing.Initializer(
            {
              env: 'AutodeskProduction',
              accessToken: token.access_token,
              language: localStorage.getItem('lang') || 'en'
            },
            () => {
              const config = { extensions: ['Autodesk.DocumentBrowser'], language: localStorage.getItem('lang') || 'en' , disabledExtensions: [
                'Autodesk.ModelStructure', 'Autodesk.PropertiesManager'
              ]};
              const viewer = new Autodesk.Viewing.GuiViewer3D(
                container,
                config
              );
              viewer.start();
              
              resolve(viewer);
            }
          );
        },
        error: (err) => reject(err),
      });
    });
  }

 // ... inside ViewerService ...

loadModel(viewer: any, urn: string): Promise<any> {
  return new Promise((resolve, reject) => {
    function onDocumentLoadSuccess(doc: any) {
      // --- LOGIC TO GET ALL VIEWS IS BEST PLACED HERE ---
      const root = doc.getRoot();
      
      // Get all 3D viewables (you can also search for role: '2d' for sheets)
      const allViewables = root.search({ 
        type: 'geometry', 
      });

      console.log('✅ All document viewables:', allViewables);
      // ---------------------------------------------------

      // Keep the existing logic to load the default view
      const defaultModel = root.getDefaultGeometry(); 
      
      viewer.loadDocumentNode(doc, defaultModel).then((model: any) => {
        console.log('✅ Model loaded successfully');
        
          // Attach to the viewer for convenience
          viewer.allViewables = allViewables; // ✅ add this line

          // Return both model and viewables
          resolve({ model, allViewables, doc }); 
      });
    }

    function onDocumentLoadFailure(code: any, message: any) {
      console.error('❌ Failed to load document:', message);
      reject({ code, message });
    }

    Autodesk.Viewing.Document.load(
      `urn:${urn}`,
      onDocumentLoadSuccess,
      onDocumentLoadFailure
    );
  });
}

  async getModelStructure(model: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      model.getObjectTree((tree: any) => {
        const result: any[] = [];
  
        const rootId = tree.getRootId();
  
        // Recursive traversal function
        const walk = (nodeId: number, parentName: string | null = null) => {
          const name = tree.getNodeName(nodeId);
          const childCount = tree.getChildCount(nodeId);
  
          const node = {
            id: nodeId,
            name: name,
            parent: parentName,
            children: [] as any[],
          };
  
          if (childCount > 0) {
            const children: number[] = [];
            tree.enumNodeChildren(
              nodeId,
              (childId: number) => {
                const childNode = walk(childId, name);
                node.children.push(childNode);
              },
              false
            );
          }
  
          return node;
        };
  
        const rootNode = walk(rootId);
        result.push(rootNode);
        resolve(result);
      }, reject);
    });
  }

  async getElementProperties(viewer: any, dbId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      viewer.getProperties(
        dbId,
        (props: any) => {
          resolve({
            dbId: props.dbId,
            name: props.name,
            externalId: props.externalId,
            properties: props.properties, // array of { displayName, displayValue, ... }
          });
        },
        (err: any) => reject(err)
      );
    });
  }
  
  
}


