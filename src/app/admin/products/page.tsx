import { Button } from '@/components/ui/button'
import { PageHeader } from '../_components/PageHeader'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import db from '@/db/db'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CheckCircle2, MoveVertical, XCircle } from 'lucide-react'
import { ActiveToggleDropdownItem, DeleteDropdownItem } from './_components/ProductAction'

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader> Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new"> Add Product</Link>
        </Button>
      </div>
      <ProductTable />
    </>
  )
}

async function ProductTable(){
  const products = await db.product.findMany({
    select: {
      id: true,
      name:true, 
      priceInCents: true, 
      isAvailbleForPurchase: true,
      _count: {select : {orders: true}}
    },
    orderBy: {name:"asc"}
  })

if (products.length === 0) return <p>No products found</p>

  return <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-0">
          <span className='sr-only'>
            Avaible For Purchase
          </span>
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Orders</TableHead>
        <TableHead className="w-0">
          <span className='sr-only'>
            Actions
          </span>
        </TableHead>      </TableRow>
    </TableHeader>
    <TableBody>
      {products.map(product=> (
        <TableRow key= {product.id}>
          <TableCell>
            {product.isAvailbleForPurchase ? (
            <>
              <CheckCircle2 /> 
              <span className='sr-only'> Available </span>
            </>
          ) : (
           <>
              <span className='sr-only'> Unavaible </span>

              <XCircle className='stroke-destructive'/>
            </>
          )}         
          </TableCell>
          <TableCell>{product.name}</TableCell>
          <TableCell>{formatCurrency(product.priceInCents/100)}</TableCell>
          <TableCell>{formatNumber(product._count.orders)}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoveVertical />
                <span className='sr-only'> Actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <a download href={`/admin/products/${product.id}/download`}>
                    Download
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link  href={`/admin/products/${product.id}/edit`}>
                    Edit
                  </Link>
                </DropdownMenuItem>
                <ActiveToggleDropdownItem 
                id = {product.id} 
                isAvailbleForPurchase={product.isAvailbleForPurchase} 
                />
                <DropdownMenuSeparator/>
                <DeleteDropdownItem 
                id = {product.id} 
                disabled={product._count.orders > 0}
                />
              </DropdownMenuContent>
            </DropdownMenu>
            </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
}