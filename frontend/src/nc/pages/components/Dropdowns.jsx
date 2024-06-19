import React, { useState } from 'react';
import SummaryBlock from './SummaryBlock';
import FilterBlock from './FilterBlock';

const Dropdowns = ({ rows, visible, rawColumns, setRows, origRows }) => {
    const [isFilterOpen, setFilterIsOpen] = useState(false);
    const [isSummaryOpen, setSummaryIsOpen] = useState(false);

    const toggleFilters = () => {
        setFilterIsOpen(!isFilterOpen);
    };

    const toggleSummary = () => {
        setSummaryIsOpen(!isSummaryOpen);
    };

    return (
        <div>
            {visible && (
            <button className="p-2 bg-gray-200 rounded" onClick={toggleSummary}>
                <strong>Summary</strong>
            </button>
            )}
            <span className="px-2"></span>
            <button className="p-2 bg-gray-200 rounded" onClick={toggleFilters}>
                <strong>Filters</strong>
            </button>
            {isSummaryOpen && (
                <div className="mt-2">
                    <SummaryBlock {...{ rows, visible }} />
                </div>
            )}
            {isFilterOpen && (
                <div className='ml-auto'>
                    <FilterBlock {...{ rawColumns, setRows, origRows }} />
                </div>
            )}
        </div>
    );
};

export default Dropdowns;