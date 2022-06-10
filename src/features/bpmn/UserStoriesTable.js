import React from "react";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from "@mui/material/TableHead";


export default function UserStoriesTable({rows}){
    //  (
    //     <table className="table">
    //         <thead>
    //         <tr>
    //             <th>"HU"</th>
    //         </tr>
    //         </thead>
    //         <tbody>
    //         {rows ? rows.map( (row, i) => {
    //             return <tr>
    //                 <td>
    //                     {row.title}
    //                 </td>
    //             </tr>
    //         }):""}
    //         </tbody>
    //     </table>
    // )
    //
    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 20 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 450 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "lightgray" }}>
                                <TableCell>
                                    {"Titulo"}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        key={index}
                                    >
                                         <TableCell>
                                            {row.title}
                                         </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}