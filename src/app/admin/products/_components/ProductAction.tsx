"use client"

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTransition } from 'react';
import { deleteProduct, toggleProductAvailability } from '../../_actions/product';
import { useRouter } from 'next/navigation';

export function ActiveToggleDropdownItem({id, isAvailbleForPurchase}: {id: string, isAvailbleForPurchase: boolean}){
  const [isPending, startTransition] = useTransition()
  return (
  <DropdownMenuItem 
  disabled={isPending}
  onClick={()=> {
    startTransition(async () => {
      await toggleProductAvailability(id, !isAvailbleForPurchase)
    })
  }}>
{(isAvailbleForPurchase) ? "Desactivate" : "Activate"}
  </DropdownMenuItem>)
}
export function DeleteDropdownItem({id, disabled} : {id:string, disabled:boolean} ){
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
  <DropdownMenuItem 
  variant ="destructive"
  disabled={disabled || isPending}
  onClick={()=> {
    startTransition(async () => {
      await deleteProduct(id)
    })
    router.refresh()
    // router.push('admin/products')

  }}>
    Delete
  </DropdownMenuItem>
  )
}