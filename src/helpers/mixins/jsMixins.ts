export const buttonVariants = ['primary', 'success', 'danger', 'ghost'];

export const defaultVariantMixin = (variants: string[]) => ({
    variant: variants,
    verifyVariant(probablyVariant: string) {
      return this.variant.includes(probablyVariant);
    }
});