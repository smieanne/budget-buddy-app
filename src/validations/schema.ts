// import { z } from "zod";

// export const transactionSchema = z.object({
//   type: z.enum(["income", "expense"]),
//   date: z.string().min(1, { message: "日付は必須です" }),
//   amount: z.number().min(1, { message: "金額は1円以上必須です" }),
//   content: z
//     .string()
//     .min(0, { message: "任意で入力" })
//     .max(50, { message: "内容は50文字以内にしてください。" }),

//   category: z
//     .union([
//       z.enum([
//         "家賃",
//         "光熱費",
//         "通信費",
//         "サブスク",
//         "食費",
//         "日用品費",
//         "交通費",
//         "交際費",
//         "医療費",
//         "美容",
//         "娯楽",
//         "被服費",
//         "その他",
//       ]),
//       z.enum(["給与", "副収入", "その他"]),
//       z.literal(""),
//     ])
//     .refine((val) => val !== "", {
//       message: "カテゴリを選択してください",
//     }),
// });

// export type Schema = z.infer<typeof transactionSchema>;

// import { z } from "zod";

// export const transactionSchema = z.object({
//   type: z.enum(["income", "expense"]),
//   date: z.string().min(1, { message: "日付は必須です" }),
//   amount: z.number().min(1, { message: "金額は1円以上必須です" }),
//   content: z
//     .string()
//     .min(0, { message: "任意で入力" })
//     .max(50, { message: "内容は50文字以内にしてください。" }),
//   category: z
//     .union([
//       z.enum([
//         "家賃",
//         "光熱費",
//         "通信費",
//         "サブスク",
//         "食費",
//         "日用品費",
//         "交通費",
//         "交際費",
//         "医療費",
//         "美容",
//         "娯楽",
//         "被服費",
//         "その他",
//       ]),
//       z.enum(["給与", "副収入", "その他"]),
//       z.literal(""),
//     ])
//     .refine((val) => val !== "", {
//       message: "カテゴリを選択してください",
//     }),
// });

// export type Schema = z.infer<typeof transactionSchema>;

// export const expenseCategories = [
//   "家賃",
//   "光熱費",
//   "通信費",
//   "サブスク",
//   "食費",
//   "日用品費",
//   "交通費",
//   "交際費",
//   "医療費",
//   "美容",
//   "娯楽",
//   "被服費",
//   "その他",
// ];

// export const incomeCategories = ["給与", "副収入", "その他"];

// import { z } from "zod";

// export const transactionSchema = z.object({
//   type: z.enum(["income", "expense"]),
//   date: z.string().min(1, { message: "日付は必須です" }),
//   amount: z.number().min(1, { message: "金額は1円以上必須です" }),
//   content: z
//     .string()
//     .min(0, { message: "任意で入力" })
//     .max(50, { message: "内容は50文字以内にしてください。" }),
//   category: z
//     .union([
//       z.enum([
//         "家賃",
//         "光熱費",
//         "通信費",
//         "サブスク",
//         "食費",
//         "日用品費",
//         "交通費",
//         "交際費",
//         "医療費",
//         "美容",
//         "娯楽",
//         "被服費",
//         "その他",
//       ]),
//       z.enum(["給与", "副収入", "その他"]),
//       z.literal(""),
//     ])
//     .refine((val) => val !== "", {
//       message: "カテゴリを選択してください",
//     }),
// });

// export type Schema = z.infer<typeof transactionSchema>;

// export const expenseCategories = [
//   "家賃",
//   "光熱費",
//   "通信費",
//   "サブスク",
//   "食費",
//   "日用品費",
//   "交通費",
//   "交際費",
//   "医療費",
//   "美容",
//   "娯楽",
//   "被服費",
//   "その他",
// ];

// export const incomeCategories = ["給与", "副収入", "その他"];
import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, { message: "日付は必須です" }),
  amount: z.number().min(1, { message: "金額は1円以上必須です" }),
  content: z
    .string()
    .min(0, { message: "任意で入力" })
    .max(50, { message: "内容は50文字以内にしてください。" }),
  category: z.string().min(1, { message: "カテゴリを選択してください" }),
});

export type Schema = z.infer<typeof transactionSchema>;

export const expenseCategories = [
  "家賃",
  "光熱費",
  "通信費",
  "サブスク",
  "食費",
  "日用品費",
  "交通費",
  "交際費",
  "医療費",
  "美容",
  "娯楽",
  "被服費",
  "その他",
];

export const incomeCategories = ["給与", "副収入", "その他"];
