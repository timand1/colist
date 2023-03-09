export const buttonVariants = ['primary', 'success', 'danger', 'ghost'];
export const listTypes = ['Shopping', 'ToDo', 'Time', 'Numbered']

export const defaultVariantMixin = (variants: string[]) => ({
    variant: variants,
    verifyVariant(probablyVariant: string) {
      return this.variant.includes(probablyVariant);
    }
});