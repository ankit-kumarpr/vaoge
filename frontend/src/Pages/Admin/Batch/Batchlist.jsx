import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  Avatar, 
  Divider, 
  IconButton,
  TextField,
  MenuItem,
  Stack,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Grid
} from "@mui/material";
import { 
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import BASE_URL from "../../../config";
import PageTitle from "../../../components/PageTitle";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
}));

const BatchCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const Batchlist = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [sortOption, setSortOption] = useState('recent');
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    Getbatchlist();
  }, []);

  const Getbatchlist = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}/admin/getbatch`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers: headers });
      if (!response.data.error) {
        setBatches(response.data.data || []);
      }
    } catch (error) {
      // console.log(error);
      setError("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches
    .filter(batch => 
      batch.batchname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === 'name') {
        return a.batchname.localeCompare(b.batchname);
      }
      return 0;
    });

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'PP');
  };

  const columns = [
    { 
      field: 'batchname', 
      headerName: 'Batch Name', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <GroupIcon />
          </Avatar>
          <Typography variant="body1" fontWeight="500">
            {params.value}
          </Typography>
        </Box>
      )
    },
    // { 
    //   field: 'students', 
    //   headerName: 'Students', 
    //   width: 120,
    //   renderCell: (params) => (
    //     <StatusChip 
    //       icon={<PersonIcon fontSize="small" />}
    //       label={params.value.length}
    //       color="info"
    //       variant="outlined"
    //     />
    //   )
    // },
    { 
      field: 'schedule', 
      headerName: 'Schedule', 
      width: 180,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {params.value.days.join(', ')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.value.time}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Created On', 
      width: 150,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: () => (
        <IconButton size="small">
          <ScheduleIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column'
      }}>
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={Getbatchlist}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <PageTitle page={"All Batch List"} />
      
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h5" component="h1">
            Batch Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
              size="small"
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
              size="small"
            >
              Table View
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <TextField
            size="small"
            placeholder="Search batches..."
            variant="outlined"
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
          
          <Stack direction="row" spacing={1}>
            <TextField
              select
              size="small"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              InputProps={{
                startAdornment: <SortIcon color="action" />,
              }}
            >
              <MenuItem value="recent">Most Recent</MenuItem>
              <MenuItem value="name">By Name</MenuItem>
            </TextField>
            
            <IconButton onClick={Getbatchlist}>
              <RefreshIcon />
            </IconButton>
          </Stack>
        </Box>
        
        {viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {filteredBatches.map((batch) => (
              <Grid item xs={12} sm={6} md={4} key={batch._id}>
                <BatchCard elevation={3}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <GroupIcon />
                      </Avatar>
                      <Typography variant="h6" component="div">
                        {batch.batchname}
                      </Typography>
                    </Box>
                    
                    {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <StatusChip 
                        icon={<PersonIcon fontSize="small" />}
                        label={`${batch.students.length} Students`}
                        color="info"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(batch.createdAt)}
                      </Typography>
                    </Box> */}
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Schedule:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {batch.schedule.days.join(', ')} at {batch.schedule.time}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<ScheduleIcon />}
                    >
                      View Schedule
                    </Button>
                  </Box>
                </BatchCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredBatches}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              getRowId={(row) => row._id}
              components={{ Toolbar: GridToolbar }}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },
              }}
            />
          </Box>
        )}
        
        {filteredBatches.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '300px',
            textAlign: 'center'
          }}>
            <FilterIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No batches found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={Getbatchlist}
            >
              Refresh Data
            </Button>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default Batchlist;