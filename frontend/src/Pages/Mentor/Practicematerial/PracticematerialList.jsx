import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilePdf } from 'react-icons/fa';
import { TextField, MenuItem } from '@mui/material';
import BASE_URL from '../../../config';
import PageTitle from '../../../components/PageTitle';

const PracticematerialList = () => {
    const token = sessionStorage.getItem('token');

    const [batchList, setBatchList] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [practiceMaterials, setPracticeMaterials] = useState([]);

    useEffect(() => {
        GetAllBatchList();
    }, []);

    const GetAllBatchList = async () => {
        try {
            const url = `${BASE_URL}/admin/getbatch`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(url, { headers });
            // console.log("Response of batch list", response.data);
            setBatchList(response.data.data);
        } catch (error) {
            // console.log("Error fetching batch list:", error);
        }
    };

    const GetPracticeMaterial = async (batchId) => {
        try {
            const url = `${BASE_URL}/admin/getpractice/${batchId}`;
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(url, { headers });
            // console.log("Response of get practice", response.data);
            setPracticeMaterials(response.data.data);
        } catch (error) {
            // console.log(error);
        }
    };

    const handleBatchChange = (event) => {
        const batchId = event.target.value;
        setSelectedBatch(batchId);
        if (batchId) {
            GetPracticeMaterial(batchId);
        } else {
            setPracticeMaterials([]);
        }
    };

    // Array of unique colors for each card
    const cardColors = ["#FFEBEE", "#E3F2FD", "#E8F5E9", "#FFF3E0", "#F3E5F5", "#E0F2F1", "#FFCDD2", "#D1C4E9", "#C5CAE9", "#B3E5FC"];

    return (
        <>
            <PageTitle page={"Practice Material"} />
            <div className="container">
                <div className="form-group">
                    <TextField
                        select
                        label="Select Batch"
                        variant="outlined"
                        fullWidth
                        value={selectedBatch}
                        onChange={handleBatchChange}
                        style={{ marginBottom: "20px" }}
                    >
                        <MenuItem value="">Select a batch</MenuItem>
                        {batchList.map((batch) => (
                            <MenuItem key={batch._id} value={batch.batchId}>
                                {batch.batchname}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div className="row mt-4">
                    {practiceMaterials.length > 0 ? (
                        practiceMaterials.map((material, index) => (
                            <div className="col-md-4" key={material._id}>
                                <div className="card shadow border-0 p-3"
                                    style={{
                                        backgroundColor: cardColors[index % cardColors.length],  // Assign different color to each card
                                        borderRadius: "10px",
                                        height: "250px"
                                    }}
                                >
                                    <div className="card-body text-center d-flex flex-column justify-content-center">
                                        <h5 className="card-title" style={{ color: "#007bff", fontWeight: "bold" }}>
                                            {material.materialname}
                                        </h5>
                                        <p className="card-text" style={{ color: "#6c757d" }}>
                                            {material.materialdescription}
                                        </p>

                                        {material.materialimages.length > 0 && (
                                            <div className="d-flex align-items-center justify-content-center">
                                                <a
                                                    href={`${BASE_URL}/${material.materialimages[0]}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-danger d-flex align-items-center"
                                                    style={{ textDecoration: "none", fontSize: "18px", fontWeight: "bold" }}
                                                >
                                                    <FaFilePdf size={40} className="me-2" />
                                                    <span>Attachment</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center mt-3">No practice materials available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default PracticematerialList;
