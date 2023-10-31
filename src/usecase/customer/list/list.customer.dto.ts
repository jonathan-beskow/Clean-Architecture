export interface InputListCustomerDto {}

type Customer = {
    id: string;
    name: string;
    address: {
        zip: any;
        city: any;
        street: string;
    }

}

export interface OutputListCustomerDto {
    customers: Customer[];
}

