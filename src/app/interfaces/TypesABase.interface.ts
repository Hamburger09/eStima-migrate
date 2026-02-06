export interface City {
    id?: number,
    name: string,
    id_country: number
}


export interface Country {
    id?: number | undefined,
    name: string,
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface Organization {
    id?: number,
    name: string,
    id_country: number,
    id_city: number
}

export interface Role {
    id?: number,
    name: string,
    description: string,
    id_status: number,
}

export interface User {
    id?: number;
    user_client_id?: string;  
    user_login: string;  
    user_password: string;  
    fio_1: string;  
    fio_2: string;  
    fio_3: string;  
    user_tel: string;  
    user_mail: string;  
    id_organization: number;
    id_country: number;
    id_city: number;
    id_status: number;
    id_role: number;
    guid?: string;
  }
  
  export interface TServerStroyka {
    id?: number;
    name: string;
    user_id_owner: number;
    user_client_id_owner: string;
    role_id?: number;
    data:JSON;
  }
  
  export interface TServerStroykaUsers {
    id?: number;
    user_id: number;
    server_stroyka_id: number;
    server_stroyka_role_id: number;
    user_client_id_owner?: string;
    id_stroyka?: number;
    name?: string;
  }
  
  export interface TServerStroykaRoles {
    id?: number;
    name: string;
  }
  
  
export interface TLog {
  id?: number;
  log_date_time: Date;  
  id_user: string;  
  log_ip: string;  
  id_log_command: number;
  log_base: string;
  log_action: string;
  log_url: string;
  log_success: number;
  req_resp: number;
  log_command_name?: string;
  user_client_id?: string;
}

export interface TLogs {
  logs: TLog[];
  totalLogs: number;
}
