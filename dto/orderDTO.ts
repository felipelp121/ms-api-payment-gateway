export type orderDTO = {
  reference_id: string;
  customer: {
    name: string;
    email: string;
    tax_id: string;
    // phones: [
    //   {
    //     country: string;
    //     area: string;
    //     number: string;
    //     type: string;
    //   },
    // ];
  };
  items: [
    {
      reference_id: string;
      name: string;
      quantity: number;
      unit_amount: number;
    },
  ];
  qr_code: {
    amount: {
      value: number;
    };
  };
  shipping: {
    address: {
      street: string;
      number: string;
      complement: string;
      locality: string;
      city: string;
      region_code: string;
      country: string;
      postal_code: string;
    };
  };
  notification_urls: Array<string>;
  charges: [
    {
      reference_id: string;
      description: string;
      amount: {
        value: number;
        currency: string;
      };
      payment_method: {
        type: string;
        installments: number;
        capture: boolean;
        card: {
          number: string;
          exp_month: string;
          exp_year: string;
          security_code: string;
          holder: {
            name: string;
          };
          store: boolean;
        };
      };
      notification_urls: Array<string>;
    },
  ];
};

export type PaymentMethod = {
  type: string;
  installments: number;
  capture: boolean;
  card: {
    number: string;
    exp_month: string;
    exp_year: string;
    security_code: string;
    holder: {
      name: string;
    };
    store: boolean;
  };
};
