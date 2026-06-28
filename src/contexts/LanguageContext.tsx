<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Grupo Ferretero Mora y Mora</title>
  </head>
  <body>
    <div id="root"></div>
    <div id="error-display" style="display:none;padding:20px;font-family:sans-serif;color:red;"></div>
    <script>
      window.onerror = function(msg, src, line, col, err) {
        document.getElementById('root').style.display = 'none';
        var d = document.getElementById('error-display');
        d.style.display = 'block';
        d.innerText = 'Error: ' + msg + '\nArchivo: ' + src + '\nLínea: ' + line;
      };
    </script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
