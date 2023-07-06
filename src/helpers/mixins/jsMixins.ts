export const buttonVariants = ['primary', 'success', 'danger', 'ghost'];
export const listTypes = ['Shopping', 'ToDo', 'Time', 'Numbered', 'Note']

export const defaultVariantMixin = (variants: string[]) => ({
    variant: variants,
    verifyVariant(probablyVariant: string) {
      return this.variant.includes(probablyVariant);
    }
});