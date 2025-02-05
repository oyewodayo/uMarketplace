export interface ProductQueryString {
    offset?: string;
    limit?: string;
  }
  
  export interface ProductParams {
    id: number;
  }
  
  export interface UpdateStockBody {
    stock: number;
  }

  
  // Add new interface for updating name
  export interface UpdateNameBody {
    name: string;
  }
  