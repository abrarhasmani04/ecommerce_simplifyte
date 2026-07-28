const SearchBar = () => {
  return (
    <div className="flex w-full max-w-xl">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full rounded-l-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
      />

      <button className="rounded-r-lg bg-blue-600 px-5 text-white hover:bg-blue-700">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
