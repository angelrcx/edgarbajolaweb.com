<#
  Renombra las imágenes de UNA carpeta a prefijo-01.jpg, prefijo-02.jpg...
  - Ordena por nombre actual (reconoce números: IMG_9 antes que IMG_10)
  - Pasa las extensiones a minúsculas (.JPG -> .jpg, .jpeg -> .jpg)
  - Sin -Aplicar solo muestra la vista previa y NO cambia nada

  Uso (desde la raíz del proyecto):
    .\scripts\renombrar.ps1 -Carpeta src\assets\fotografia -Prefijo foto            (vista previa)
    .\scripts\renombrar.ps1 -Carpeta src\assets\fotografia -Prefijo foto -Aplicar   (renombra)
#>
param(
  [Parameter(Mandatory)] [string]$Carpeta,
  [Parameter(Mandatory)] [string]$Prefijo,
  [switch]$Aplicar
)

$validas = '.jpg', '.jpeg', '.png', '.webp'
$todos = Get-ChildItem -LiteralPath $Carpeta -File
$imagenes = $todos | Where-Object { $validas -contains $_.Extension.ToLower() } |
  Sort-Object { [regex]::Replace($_.Name, '\d+', { $args[0].Value.PadLeft(10, '0') }) }

$ignorados = $todos | Where-Object { $validas -notcontains $_.Extension.ToLower() }
if ($ignorados) {
  Write-Host "`nNo se tocan (formato no válido para la web):" -ForegroundColor Yellow
  $ignorados | ForEach-Object { Write-Host "  $($_.Name)" }
}

$ancho = [Math]::Max(2, "$($imagenes.Count)".Length)
$n = 1
$plan = foreach ($img in $imagenes) {
  $ext = $img.Extension.ToLower().Replace('.jpeg', '.jpg')
  [pscustomobject]@{
    Archivo = $img
    Nuevo   = '{0}-{1}{2}' -f $Prefijo, $n.ToString().PadLeft($ancho, '0'), $ext
  }
  $n++
}

Write-Host "`nPlan ($($plan.Count) imágenes):" -ForegroundColor Cyan
$plan | ForEach-Object { Write-Host ("  {0}  ->  {1}" -f $_.Archivo.Name, $_.Nuevo) }

if (-not $Aplicar) {
  Write-Host "`nVista previa. Si se ve bien, repite el comando agregando -Aplicar" -ForegroundColor Cyan
  return
}

# Paso 1: nombres temporales (evita choques entre nombres viejos y nuevos)
$temporales = foreach ($p in $plan) {
  $tmp = 'tmp_' + [guid]::NewGuid().ToString('N') + $p.Archivo.Extension
  Rename-Item -LiteralPath $p.Archivo.FullName -NewName $tmp
  [pscustomobject]@{ Ruta = Join-Path $p.Archivo.DirectoryName $tmp; Nuevo = $p.Nuevo }
}
# Paso 2: nombres finales
foreach ($t in $temporales) { Rename-Item -LiteralPath $t.Ruta -NewName $t.Nuevo }
Write-Host "`nListo: $($plan.Count) imágenes renombradas." -ForegroundColor Green
