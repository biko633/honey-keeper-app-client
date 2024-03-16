import DOMPurify from "dompurify";

export const cleanHTML = (content) => {
  const clean = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
  });
  return clean;
};
