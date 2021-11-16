import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjectsList } from './tableServices';

const rows = [];

const headCells = [];

const initialState = {
    headers: headCells,
    rows: rows,
    selected: [],
    order: 'asc',
    orderBy: 'name',
    page: 0,
    dense: false,
    rowsPerPage: 5,
    loading: 'idle',
    apiName: "",
    records: 0
};

export const loadData = createAsyncThunk(
  'table/getProjectsList',
  async (query) => {
    const response = await getProjectsList(query)
    return response.data;
  }
);

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
      setHeaders: (state, action) => {
        state.headers = action.payload;
      },
      setRows: (state, action) => {
        state.rows = action.payload;
      },
      setOrderBy: (state, action) => {
        state.order = action.payload.order;
        state.orderBy = action.payload.orderBy;
      },
      setSelected: (state, action) => {
        state.selected  = action.payload;
      },
      setPage: (state, action) => {
        state.page  = action.payload;
      },
      setDense: (state, action) => {
        state.dense  = action.payload;
      },
      setRowsPerPage: (state, action) => {
        state.rowsPerPage  = action.payload;
      },
      setApiName: (state, action) => {
        state.apiName  = action.payload;
      },
      setRecords: (state, action) => {
        state.records  = action.payload;
      },
      setLoading: (state, action) => {
        state.records  = action.payload;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(loadData.pending, (state) => {
          state.loading = 'loading';
        })
        .addCase(loadData.fulfilled, (state, action) => {
          state.loading = 'idle';
          state.rows = action.payload.data;
          state.records = action.payload.recordsFiltered;
        })
        .addCase(loadData.rejected, (state, action) => {
          state.loading = 'idle';
        })
        .addDefaultCase((state, action) => {})
    },
});

export const {
    setHeaders,
    setRows,
    setOrder,
    setOrderBy,
    setSelected,
    setPage,
    setDense,
    setRowsPerPage,
    setRecords,
    setLoading,
    setApiName
} = tableSlice.actions;

export const selectHeaders = (state) => state.table.headers;
export const selectRows = (state) => state.table.rows;
export const selectSelected = (state) => state.table.selected;
export const selectOrder = (state) => state.table.order;
export const selectOrderBy = (state) => state.table.orderBy;
export const selectPage = (state) => state.table.page;
export const selectDense = (state) => state.table.dense;
export const selectRowsPerPage = (state) => state.table.rowsPerPage;
export const selectLoading = (state) => state.table.loading;
export const selectApiName = (state) => state.table.apiName;
export const selectRecords = (state) => state.table.records;

export default tableSlice.reducer;
