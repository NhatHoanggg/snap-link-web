export interface Bank {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
}

export interface BankApiResponse {
    code: string;
    desc: string;
    data: Bank[];
}
