function generateSlug(name: string) {
  name = name.replace(/^\s+|\s+$/g, "");
  name = name.toLowerCase();
  name = name
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return name;
}

const slugfier = {
  generateSlug,
};

export default slugfier;
