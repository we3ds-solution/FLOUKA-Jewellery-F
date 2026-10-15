import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { X } from 'lucide-react';
import { LordIcon } from '@/components/store/lord-icon';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/stores/compare';
import { formatCurrency } from '@/lib/shopify';
import { CompareIcon } from './compare-icon';

export function ComparePanel() {
  const { items, open, setOpen, toggle, clear } = useCompare();
  const [details, setDetails] = useState(false);
  return <Sheet open={open} onOpenChange={value => { setOpen(value); if (!value) setDetails(false); }}>
    <SheetContent side="bottom" variant="comparison" aria-describedby={undefined}>
      <header className="compare-panel-heading">
        <SheetTitle>مقارنة المنتجات</SheetTitle>
        <p className="text-muted-foreground">({items.length} المنتجات)</p>
      </header>
      {items.length > 0 && <>
        <div className="compare-panel-products">
          {items.map(product => <article key={product.id} className="compare-panel-product">
            <Button variant="ghost" size="icon" className="compare-remove" aria-label={`إزالة ${product.title}`} onClick={() => toggle(product)}><X className="size-4" /></Button>
            <Link to="/product/$handle" params={{ handle: product.handle }} onClick={() => setOpen(false)}>
              <img src={product.images.edges[0]?.node.url} alt={product.title} />
              <span>{product.title}</span>
            </Link>
            <b>{formatCurrency(product.priceRange.minVariantPrice)}</b>
          </article>)}
        </div>
        <div className="compare-panel-actions">
          <Button variant="accent" onClick={() => setDetails(value => !value)} aria-expanded={details}><CompareIcon className="size-4" />{details ? 'إخفاء التفاصيل' : 'مقارنة المنتجات'}</Button>
          <Button variant="outline" onClick={() => { clear(); setDetails(false); }}><LordIcon name="trash" size={16} />مسح الكل</Button>
        </div>
        {details && <div className="compare-details"><table className="compare-table">
          <thead><tr><th scope="col">المنتج</th>{items.map(p => <th scope="col" key={p.id}>{p.title}</th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">السعر</th>{items.map(p => <td key={p.id}>{formatCurrency(p.priceRange.minVariantPrice)}</td>)}</tr>
            <tr><th scope="row">القسم</th>{items.map(p => <td key={p.id}>{p.productType || 'إكسسوارات'}</td>)}</tr>
            <tr><th scope="row">التوفر</th>{items.map(p => <td key={p.id}>{p.variants.edges.some(v => v.node.availableForSale) ? 'متوفر' : 'غير متوفر'}</td>)}</tr>
            <tr><th scope="row">التفاصيل</th>{items.map(p => <td key={p.id}>{p.description || '—'}</td>)}</tr>
          </tbody>
        </table></div>}
      </>}
    </SheetContent>
  </Sheet>;
}