const CategoryCard = ({ image, title }) => {
  return (
    <div className="cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={image}
        alt={title}
        className="mx-auto h-24 w-24 object-contain"
      />

      <h3 className="mt-4 text-center font-semibold">{title}</h3>
    </div>
  );
};

export default CategoryCard;
