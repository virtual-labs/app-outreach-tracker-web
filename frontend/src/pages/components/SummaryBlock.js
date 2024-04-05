const SummaryBlock = ({ rows, visible }) => {
  const total_p = rows.reduce((acc, row) => {
    return acc + row["Participants"];
  }, 0);

  const total = rows.length;

  const total_r = rows.reduce((acc, row) => {
    return acc + row["Usage Recorded"];
  }, 0);

  return (
    <div className="flex-1 m-2">
      {visible ? (
        <div className="font-bold	 bg-gray-100 h-full p-1  rounded">
          <label className="bold">Summary</label>
          <div className="flex flex-row justify-start p-2">
            <div className="flex flex-col mx-2 p-2 bg-gray-200 rounded m-1">
              <span>Total Participants</span>
              <span>{total_p}</span>
            </div>
            <div className="flex flex-col mx-2 p-2 bg-gray-200 rounded m-1">
              <span>Total Recorded</span>
              <span>{total_r}</span>
            </div>
            <div className="flex flex-col mx-2 p-2 bg-gray-200 rounded m-1">
              <span>Total Workshops</span>
              <span>{total}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SummaryBlock;
