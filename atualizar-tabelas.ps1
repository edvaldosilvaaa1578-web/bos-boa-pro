# Script para atualizar referências de tabelas no projeto BOS/BOA
$projeto = "C:\Users\edval\OneDrive\Desktop\bos-boa-pro"

$arquivos = @(
    "$projeto\app\(dashboard)\dashboard\page.tsx",
    "$projeto\app\(dashboard)\registros\page.tsx",
    "$projeto\app\(dashboard)\colaboradores\page.tsx",
    "$projeto\app\(dashboard)\ranking\page.tsx",
    "$projeto\app\(dashboard)\relatorios\page.tsx",
    "$projeto\components\registros\RegistrosClient.tsx",
    "$projeto\components\colaboradores\ColaboradoresClient.tsx"
)

foreach ($arquivo in $arquivos) {
    if (Test-Path $arquivo) {
        $conteudo = Get-Content $arquivo -Raw
        $conteudo = $conteudo -replace "from\('registros'\)", "from('registros_v2')"
        $conteudo = $conteudo -replace "from\('colaboradores'\)", "from('colaboradores_v2')"
        Set-Content $arquivo $conteudo -NoNewline
        Write-Host "✅ Atualizado: $arquivo"
    } else {
        Write-Host "⚠️ Não encontrado: $arquivo"
    }
}

Write-Host ""
Write-Host "Fazendo commit e push..."
git -C $projeto add .
git -C $projeto commit -m "fix: atualizar tabelas para colaboradores_v2 e registros_v2"
git -C $projeto push origin main
Write-Host "✅ Deploy iniciado!"
