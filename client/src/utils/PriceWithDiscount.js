export const pricewithDiscount = (price, dis = 0)=>{
    // Handle edge cases
    if (!price || isNaN(price)) return 0;
    if (!dis || isNaN(dis)) return Number(price);
    
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}