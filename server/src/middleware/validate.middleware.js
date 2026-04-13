import AppError from "../utils/AppError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return next(new AppError("Validation failed", 400, details));
    }

    req.body = result.data;
    next();
  };
};

export default validate;