export const buttonVariants = ['primary', 'success', 'danger', 'ghost'];
export const listTypes = ['Shoppinglist'] //ADD LATER

export const defaultVariantMixin = (variants: string[]) => ({
    variant: variants,
    verifyVariant(probablyVariant: string) {
      return this.variant.includes(probablyVariant);
    }
});