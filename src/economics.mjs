export const exampleInputs={visits:1000,rate:2,price:50,variable:15,acquisition:200,fixed:400};
export const economicsFields=[
  {id:"visits",label:"Site visits in one month",value:1000,min:0,max:10000000,step:1},
  {id:"rate",label:"Completed-order rate (%)",value:2,min:0,max:100,step:0.1},
  {id:"price",label:"Average net revenue per order (USD)",value:50,min:0,max:1000000,step:0.01},
  {id:"variable",label:"Variable cost per order (USD)",value:15,min:0,max:1000000,step:0.01},
  {id:"acquisition",label:"Acquisition spending this month (USD)",value:200,min:0,max:100000000,step:0.01},
  {id:"fixed",label:"Other fixed costs this month (USD)",value:400,min:0,max:100000000,step:0.01}
];
export function calculateEconomics(input) {
  for(const field of economicsFields) {
    const value=input[field.id];
    if(typeof value!=="number"||!Number.isFinite(value)||value<field.min||value>field.max)throw new RangeError(`${field.label} must be between ${field.min} and ${field.max}.`);
    if(field.id==="visits"&&!Number.isInteger(value))throw new RangeError("Site visits must be a whole number.");
    if(!["visits","rate"].includes(field.id)&&Math.abs(value*100-Math.round(value*100))>0.00001)throw new RangeError(`${field.label} must use no more than two decimal places.`);
  }
  const priceCents=Math.round(input.price*100),variableCents=Math.round(input.variable*100);
  const periodCostCents=Math.round(input.acquisition*100)+Math.round(input.fixed*100);
  const orders=input.visits*input.rate/100;
  const revenue=orders*priceCents/100,variableCost=orders*variableCents/100;
  const contributionPerOrder=(priceCents-variableCents)/100;
  const contribution=revenue-variableCost;
  const periodCost=periodCostCents/100;
  const surplus=contribution-periodCost;
  const breakEvenOrders=priceCents>variableCents?Math.ceil(periodCostCents/(priceCents-variableCents)):null;
  return {orders,revenue,variableCost,contributionPerOrder,contribution,periodCost,surplus,breakEvenOrders};
}
