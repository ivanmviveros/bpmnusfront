import React from "react";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from "@mui/material/TableHead";


export default function UserStoriesTable({rows, handleRowSelected}){
    return (
        <Box sx={{ width: '100%' }}>
            <>
                <TableContainer>
                    <h3>Listado de historias de usuario</h3>
                    <Table
                        sx={{ minWidth: 200 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "lightgray" }}>
                                <TableCell>
                                    {"Id"}
                                </TableCell>
                                <TableCell>
                                    {"Titulo"}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => {
                                return (
                                    <TableRow
                                        hover
                                        key={row.id}
                                        onClick={(e) => {
                                            handleRowSelected(e, row.id)
                                        }}
                                    >
                                        <TableCell>
                                            {row.data.id}
                                        </TableCell>
                                         <TableCell>
                                            {row.data.title}
                                         </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        </Box>
    );
}