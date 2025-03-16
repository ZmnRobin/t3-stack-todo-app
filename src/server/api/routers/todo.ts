import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const todoRouter = createTRPCRouter({
  // Get all todos for the logged-in user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.todo.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Create a new todo
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Toggle todo completion
  toggleComplete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.findUnique({ where: { id: input.id } });
      if (!todo) throw new Error("Todo not found");

      return ctx.db.todo.update({
        where: { id: input.id },
        data: { completed: !todo.completed },
      });
    }),

  // Delete a todo
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: { id: input.id },
      });
    }),
});
