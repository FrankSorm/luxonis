import React, { useState, useEffect } from 'react';
import Listing from './Listing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesLeft, faAngleLeft, faAnglesRight, faAngleRight } from '@fortawesome/free-solid-svg-icons'

interface DataItem {
  id: number;
  title: string;
  image_url: string;
}

interface ApiResponse {
  data: DataItem[];
  page: number;
  totalPages: number;
  totalCount: number;
}

const faAnglesLeftIcon = <FontAwesomeIcon icon={faAnglesLeft} />
const faAngleLeftIcon = <FontAwesomeIcon icon={faAngleLeft} />
const faAnglesRightIcon = <FontAwesomeIcon icon={faAnglesRight} />
const faAngleRightIcon = <FontAwesomeIcon icon={faAngleRight} />

const DataList: React.FC<{}> = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const visiblePages = 5; // Number of shown pages

  const fetchData = async (page: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/data?page=${page}`);
      const result: ApiResponse = await response.json();
      setData(result.data);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container">
      <h2>Flats for sale</h2>
      <p>Data scraped from portal SReality.cz</p>
      <div className="data-list">
        {data.map((item, index) => (
          <Listing key={index} title={item.title} imageUrl={item.image_url} />
        ))}
      </div>

      <div className="pagination-stats">Page {currentPage} / {totalPages} | Total items: {totalCount}</div>
      <div className="pagination">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
        <FontAwesomeIcon icon={faAnglesLeft} /> First 
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <FontAwesomeIcon icon={faAngleLeft} /> Previous 
        </button>

        {Array.from({ length: Math.min(visiblePages, totalPages) }, (_, index) => {
          const pageNumber = index + 1;
          const startPage = Math.max(1, Math.min(currentPage - Math.floor(visiblePages / 2), totalPages - visiblePages + 1));
          
          return (
            <button key={pageNumber} onClick={() => handlePageChange(startPage + index)} disabled={pageNumber === currentPage}>
              <strong>{startPage + index}</strong>
            </button>
          );
        })}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Last <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>

    </div>
  );
};

export default DataList;