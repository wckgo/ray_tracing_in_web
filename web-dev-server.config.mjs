export default {
  middleware: [
    (context, next) => {
      context.set("Cross-Origin-Opener-Policy", "same-origin");
      context.set("Cross-Origin-Embedder-Policy", "require-corp");      
      return next();
    },
  ],
};
