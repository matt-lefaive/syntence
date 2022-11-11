import React from 'react';

const CSVTable = ({ columns }) => {
    
    const rows = [];
    const headers = Object.keys(columns);
    for (let i = 0; i < columns[headers[0]].length; i++) {
        const row = [];
        for (let j = 0; j < headers.length; j++) {
            row.push(columns[headers[j]][i]);
        }
        rows.push(row);
    }

    return (
        <table className='csv-table'>
            <thead>
                <tr>
                    {Object.keys(columns).map((h, i) => {
                        return <th key={`${h}-${i}`}>{h}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => {
                    return (
                        <tr key={`row-${i}`}>
                            {row.map((d, j) => {
                                return (
                                    <td key={`td-${i}-${j}`}>{d}</td>
                                )
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default CSVTable;