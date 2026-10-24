(function(){
  const money = n => '₹' + (Number(n)||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
  const list = document.getElementById('sale-items');
  const add = document.getElementById('add-item');
  if (!list) return;
  function recalc(){
    let subtotal=0;
    list.querySelectorAll('.sale-line').forEach(row=>{
      const select=row.querySelector('.sale-product'), qtyInput=row.querySelector('.sale-qty');
      const option=select.options[select.selectedIndex];
      const price=option ? Number(option.dataset.price||0) : 0;
      const rate=option ? Number((document.getElementById('tax-type')?.value==='CST' ? option.dataset.cst : option.dataset.gst)||0) : 0;
      const stock=option ? Number(option.dataset.stock||0) : 0;
      const qty=Number(qtyInput.value||0);
      if(option && select.value && qty>stock){qtyInput.setCustomValidity('Only '+stock+' item(s) available.');} else qtyInput.setCustomValidity('');
      const total=select.value && qty>0 ? price*qty : 0; subtotal+=total; row.dataset.taxable=String(total); row.dataset.tax=String(total*rate/100);
      row.querySelector('.line-total b').textContent=money(total);
    });
    const discount=Math.max(0,Number(document.getElementById('discount')?.value||0));
    let rawTax=0; list.querySelectorAll('.sale-line').forEach(row=>rawTax+=Number(row.dataset.tax||0));
    const tax=rawTax*(subtotal>0 ? Math.max(0,subtotal-discount)/subtotal : 0);
    document.getElementById('tax-display').textContent=money(tax);
    document.getElementById('subtotal').textContent=money(subtotal);
    document.getElementById('discount-display').textContent=money(discount);
    document.getElementById('total').textContent=money(Math.max(0,subtotal-discount)+tax);
  }
  if(add){add.addEventListener('click',()=>{const row=list.querySelector('.sale-line').cloneNode(true);row.querySelector('.sale-product').selectedIndex=0;row.querySelector('.sale-qty').value='1';list.appendChild(row);recalc();});}
  list.addEventListener('input',recalc); list.addEventListener('change',recalc);
  list.addEventListener('click',e=>{if(e.target.closest('.remove-line')){const rows=list.querySelectorAll('.sale-line');if(rows.length>1)e.target.closest('.sale-line').remove();else{rows[0].querySelector('.sale-product').selectedIndex=0;rows[0].querySelector('.sale-qty').value=1;}recalc();}});
  document.getElementById('discount')?.addEventListener('input',recalc);
  document.getElementById('tax-type')?.addEventListener('change',recalc);
  document.getElementById('sale-form')?.addEventListener('submit',e=>{if(!list.querySelector('.sale-product').value){e.preventDefault();alert('Please select at least one product.');}});
  recalc();
})();
