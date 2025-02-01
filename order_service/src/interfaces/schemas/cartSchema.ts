import { Static, Type } from '@sinclair/typebox';

export const CartRequestSchema = Type.Object({
  productId: Type.Integer(),
  customerId: Type.Integer(),
  qty: Type.Integer(),
});

export const CartResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
});

export const CardEditRequestSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});

export type CardEditRequestInput = Static<typeof CardEditRequestSchema>;
