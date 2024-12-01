import { environment } from "../environments/environment";

export class ConstantsHelper {
  public static readonly getAPIUrl = {
    loginUser: () => `${environment.baseUrl}/login`,
    transactions: () => `${environment.baseUrl}/transactions`,
    users: () => `${environment.baseUrl}/users`,
    products: () => `${environment.baseUrl}/products`,
    referals: () => `${environment.baseUrl}/referals`,
    billing: () => `${environment.baseUrl}/billing`,
    downloadBilling: () => `${environment.baseUrl}/billing/records/download`,
    downloadTransaction: () => `${environment.baseUrl}/admin/transactions/download`,
    raiseFlag: () => `${environment.baseUrl}/billing/records/flag`,
    dashboard: () => `${environment.baseUrl}/dashboard`,
    clientsDropdown: () => `${environment.baseUrl}/clientsDropdown`,
    clients: () => `${environment.baseUrl}/clients`,
    addClient: () => `${environment.baseUrl}/clients/add`,

  };
}
