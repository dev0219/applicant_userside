export interface addressData {
  street_number?: string;
  route?: string;
  address?: string;
  locality?: string;
  administrative_area_level_1?: string;
  country?: string;
  postal_code?: string;
}

export interface discountsData {
  alarm: any;
  new_roof: any;
  bundle: any;
  good_credit: any;
  claim_free: any;
  life_insurance: any;
  roof_shape:any;
  basement_finished:any;
  dog:any;
  pool:any;
  smoke_detector:any;
}

export interface zillowData {
  value: string;
  square: string;
  built_year: string;
  estimate: string;
}

export interface personData {
  first_name: string;
  last_name: string;
  birthday: string;
  license: any;
}

export interface carData {
  year: string;
  type: string;
  model: string;
}

export interface CarYearData {
  year: number;
}


export interface questionsData {
  personal_articles?: boolean;
  personal_articles_answer?:string;
  haven_life?: number;
  is_umbrella_policy?: boolean;
}

export interface yearData {
  roof_year?: number,
  plumbing_year?: number,
  ac_year?: number,
  electric_year?: number
}
