export interface TTransfer {
    id?: number;
    user_id_sender: number;
    user_id_recipient: number;
    send_date_time: Date | null; // Allow null based on log
    transfer_type: number;
    transfer_status: number;
    note: string;
    content: ConstructionData; // Replace JSON with ConstructionData
  }
  
  export interface TreeNode {
    id: number;
    name: string;
    num?: number; // Optional, from backend
    num_st?: string;
    guid?: string;
    smetas?: TreeNode[];
  }
  
  export interface ConstructionData {
    id: number;
    name: string;
    num?: number;
    num_st?: string;
    guid?: string;
    selectedIndex?: number;
    obekts: ConstructionObject[];
    razdel_svod_resurs_list: SvodResursGroup[]; // fixed here
  }
  
  export interface SvodResursGroup {
    name: string;
    svod_resurs: svod_resurs[];
  }
  export interface svod_resurs {
    id: number;
    num: number;
    num_st: string;
    name: string;
    guid: string;
    kodv: string;
    kode: string;
    gauge_name: string;
    price: number;
    summa: number;
    kol: number;
  }
  
  export interface TNotification<T = any> {
    id?: number;
    type: string;
    title: string;
    message: string;
    data: T;
    user_id: number;
    create_at: Date;
    is_read: boolean;
  }
  
  export interface ConstructionObject {
    guid: string;
    id?: number;
    id_stroyka: number;
    name: string;
    num: string;
    num_reg: string;
    version: number;
    smetas?: ConstructionSmeta[];
  }
  
  export interface ConstructionSmeta {
    def_constants?: string;
    guid: string;
    id?: number;
    id_obekt: number;
    name: string;
    num: string;
    num_reg: string;
    version: number;
    poprav?: string;
    razdels?: ConstructionRazdel[];
  }
  
  
  export interface ConstructionRazdel {
    error: number;
    gauge_name: string;
    guid: string;
    hide_res: number;
    id?: number;
    id_obekt: number;
    id_smeta: number;
    id_stroyka: number;
    kol: number;
  
  }