export interface BusinessTypeGroup {
  industry: string;
  industry_description: string;
  business_types: { id: string; business_type: string }[];
}
