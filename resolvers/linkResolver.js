const LinkResolver = (doc) => {
  if (doc.type === 'about') return `/${doc.type}`;
  console.log(doc);
  return '/';
};

export default LinkResolver;
