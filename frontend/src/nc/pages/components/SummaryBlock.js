const SummaryBlock = ({ rows, visible }) => {
  const total_p = rows.reduce((acc, row) => {
    return acc + row["Participants"];
  }, 0);

  const total = rows.length;

  const total_r = rows.reduce((acc, row) => {
    return acc + row["Usage Recorded"];
  }, 0);

  return (
    <div className={`${visible ? "flex-1" : ""}`}>
      {visible ? (
        <div className="w-64 mx-auto">
          <div className="bg-gray-100 rounded-lg p-4 pt-0.5 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-800 mt-2 mb-2">Workshop Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Participants:</span>
                <span className="font-semibold text-blue-600">{total_p}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Recorded:</span>
                <span className="font-semibold text-green-600">{total_r}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Workshops:</span>
                <span className="font-semibold text-purple-600">{total}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>);
};

export default SummaryBlock;
