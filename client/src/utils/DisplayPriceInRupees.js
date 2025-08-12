export const DisplayPriceInRupees = (price)=>{
    // Handle edge cases
    if (!price || isNaN(price)) return '₹0.00';
    
    return new Intl.NumberFormat('en-IN',{
        style : 'currency',
        currency : 'INR'
    }).format(price)
}