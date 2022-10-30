import React from "react";

export default function FilterPagination({ filterData, pageCount }) {
  return (
    <>
      <div className="my-4 btn-main d-flex justify-content-center mx-0">
        {Array(pageCount)
          .fill(1)
          .map((v, i) => {
            return (
              <button
                className="btn btn-clr  ms-2"
                onClick={(event) => filterData(event, "page")}
                value={i + 1}
                key={i}
              >
                {i + 1}
              </button>
            );
          })}
      </div>
    </>
  );
}