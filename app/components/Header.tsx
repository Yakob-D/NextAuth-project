import React from "react";

const Header = (num: number) => {
  return (
    <div className="flex justify-between items-center mb-10 ml-30 mr-105 mt-15">
      <div>
        <h1 className="text-[#25324B] font-black text-3xl">Opportunities</h1>
        <p className="text-gray-500">Showing {num} results</p>
      </div>
      <div className="flex gap-4 items-center">
        <p className="text-gray-500">Sort by:</p>
        <select name="sort" id="sort">
          <option value="relevance">Most relevant</option>
          <option value="date">Date Posted</option>
          <option value="company">Company</option>
        </select>
      </div>
    </div>
  );
};

export default Header;