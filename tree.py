import os

IGNORAR = {"node_modules", ".git", "__pycache__"}  # carpetas a ignorar
NO_EXPANDIR = {"generated"}  # carpetas que se muestran pero no se expanden

def listar_directorio(raiz, prefijo=""):
    contenido = sorted(
        [nombre for nombre in os.listdir(raiz) if nombre not in IGNORAR]
    )
    for i, nombre in enumerate(contenido):
        ruta = os.path.join(raiz, nombre)
        conector = "└── " if i == len(contenido) - 1 else "├── "
        print(prefijo + conector + nombre)
        if os.path.isdir(ruta) and nombre not in NO_EXPANDIR:
            extension = "    " if i == len(contenido) - 1 else "│   "
            listar_directorio(ruta, prefijo + extension)

if __name__ == "__main__":
    carpeta_raiz = "."  # Cambia si quieres otra carpeta
    print(os.path.basename(os.path.abspath(carpeta_raiz)) + "/")
    listar_directorio(carpeta_raiz)
