import { Eye, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { formatDate } from '../../lib/utils'

export default function HistoryTable({ rows, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead>#</TableHead>
          <TableHead>Filename</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.id}>
            <TableCell>{rows.length - index}</TableCell>
            <TableCell className="font-medium text-white">{row.filename}</TableCell>
            <TableCell>{formatDate(row.timestamp)}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Link to={`/insights/${row.id}`}>
                  <Button variant="secondary" size="sm" type="button">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Button variant="danger" size="sm" type="button" onClick={() => onDelete(row.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
