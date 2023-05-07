class productos {
    constructor(id, nombre, precio, descripcion, stock, img, alt) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.cantidad = 1;
        this.stock = stock;
        this.img = img;
        this.alt = alt
    }
}

//Defino Controlador de lista de producto.

class ProductosControler {
    constructor() {
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos")
    }

    async levantar_mostrar() {
        const resp = await fetch("www.bd.json")
        this.listaProductos = await resp.json()

        this.mostrarEnDOM()
        this.darEventoClickProductos(controladorCarrito)
        
    }

    levantarProductos() {
        this.listaProductos = [
            new productos(1, "Ramen", 450, "Fideos instantáneos con caldo saborizado en polvo de origen japonés.", 5, "https://http2.mlstatic.com/D_NQ_NP_636812-MLA53380756811_012023-O.webp", "Ramen Instantáneo"),
            new productos(2, "Salsa de soja", 1300, "Salsa a base de soja líquida.", 10, "https://http2.mlstatic.com/D_NQ_NP_660875-MLA46165032674_052021-O.webp", "Salsa de soja"),
            new productos(3, "Palillos", 500, "Utencillos fabricados con metal.", 22, "https://http2.mlstatic.com/D_NQ_NP_633110-MLA69120774120_042023-O.webp", "Palillos chinos"),
            new productos(4, "Licor coreano", 2100, "Bebida alcholica de origen coreano.", 8, "https://http2.mlstatic.com/D_NQ_NP_735901-MLA44986915629_022021-O.webp", "Licor coreano"),
            new productos(5, "Licor japonés", 2100, "Bebida alcholica de origen japonés.", 6, "https://http2.mlstatic.com/D_NQ_NP_781455-MLA49897935196_052022-O.webp", "Licor japonés"),
            new productos(6, "Arroz para sushi", 700, "Arroz de uso exclusivo para preparación de sushi.", 12, "https://http2.mlstatic.com/D_NQ_NP_635233-MLA54020976810_022023-O.webp", "Arroz para sushi"),
            new productos(7, "Algas Nori", 2350, "Algas deshidratadas para consumo.", 9, "https://http2.mlstatic.com/D_NQ_NP_634574-MLA46683070428_072021-O.webp", "Algas Nori"),
            new productos(8, "Jugo coreano", 1300, "Jugo de origen coreano en lata.", 5, "https://http2.mlstatic.com/D_NQ_NP_659657-MLA49621869706_042022-O.webp", "Jugo en lata"),
            new productos(9, "Cerveza japonesa", 900, "Cervezas de origen japonés en lata.", 7, "https://http2.mlstatic.com/D_NQ_NP_715666-MLA46910285842_072021-O.webp", "Cerveza japonesa"),
            new productos(10, "Pepero", 1150, "Golosinas de origen coreano.", 11, "https://http2.mlstatic.com/D_NQ_NP_676819-MLA51076574917_082022-O.webp", "Pepero"),
            new productos(11, "Set sushi", 4700, "Set de vasijas de cerámica para sushi.", 4, "https://http2.mlstatic.com/D_NQ_NP_652674-MLA53128500921_012023-O.webp", "Set sushi"),
            new productos(12, "Vasos japoneses", 1250, "Vasos de ceramica para licor asiático.", 2, "https://http2.mlstatic.com/D_NQ_NP_739837-MLA50998610955_082022-O.webp", "Vasos asiáticos"),

        ]
    }

    mostrarEnDOM() {
        // Se muestra los productos de manera dinámica
        this.listaProductos.forEach(productos => {
            this.contenedor_productos.innerHTML += ` 
                     <div class="card" style="width: 18rem; background-color: #FAD7A0;">
                        <img src="${productos.img}" class="card-img-top" width= "469" height="400" alt="${productos.alt}" >
                        <div class="card-body">
                            <h5 class="card-title">${productos.nombre}</h5>
                            <p class="card-text">${productos.descripcion}</p>
                            <p class="card-text">Precio: $${productos.precio}.</p>
                            <p class="card-text">Cantidad: ${productos.cantidad}.</p>
                            <a href="#" id= "cpu-${productos.id}" class="btn btn-primary">Añadir al carrito de compra</a>
                        </div>
                    </div>`
        })
    }
    
    darEventoClickProductos(controladorCarrito) {
     
        this.listaProductos.forEach(productos => {
            const btnAP = document.getElementById(`cpu-${productos.id}`)
            btnAP.addEventListener("click", () => {

                controladorCarrito.agregar(productos)
                controladorCarrito.guardarEnStorage()
                controladorCarrito.mostrarEnDOM(contenedor_carrito)
                
                Toastify({

                    text: `¡${productos.nombre} añadido!`,
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    style: {
                        background: "#7683D7"
                    }
                }).showToast()
            })

           
        })

        const finalizar_compra = document.getElementById("finalizar_compra")
        finalizar_compra.addEventListener("click", () => {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: '¡Compra realizada con éxito!',
                        color: '#716add',
                        showConfirmButton: false,
                        timer: 1500
                    })
    
                    controladorCarrito.limpiarContenedor()
                    controladorCarrito.limpiarCarritoEnStorage()
                    controladorCarrito.listaCarrito = []
        })          

    }
}

class CarritoControler {
    constructor() {
        this.listaCarrito = []
        this.contenedor_carrito = document.getElementById("contenedor_carrito")
        this.precio_total = document.getElementById ("precio_total")
        this.total = document.getElementById("Total")
    }


    verificarExistenciaDeProducto(productos){
        return this.listaCarrito.find((elproducto)=> elproducto.id == productos.id)
    }

    agregar(productos) {
        
        let objeto = this.verificarExistenciaDeProducto(productos)

        if(objeto){
            objeto.cantidad += 1 ;
        } else {{
            this.listaCarrito.push(productos)
        }
        }
        

        this.mostrarTotalEnDOM(controladorCarrito)
    }

    limpiarCarritoEnStorage() {
        localStorage.removeItem("listaCarrito")
    }


    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }


    levantarDeStorage() {
        this.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || []
        if (this.listaCarrito.length > 0) {
            this.mostrarEnDOM()
        }
    }

    limpiarContenedor() {
        this.contenedor_carrito.innerHTML = ""
    }


    mostrarEnDOM() {
        this.limpiarContenedor()
        this.listaCarrito.forEach(productos => {
            this.contenedor_carrito.innerHTML +=
                `<div class="card mb-3" style="max-width: 540px;">
    <div class="row g-0">
        <div class="col-md-4">
        <img src="${productos.img}" class="img-fluid rounded-start" alt="${productos.alt}">
        <div class="card-body">
        </div>
            <div class="col-md-8">
                <div class="card-body">
                <h5 class="card-title">${productos.nombre}</h5>
                <p class="card-text">Precio: $${productos.precio}</p>
                <p class="card-text">Cantidad: ${productos.cantidad}</p>
                 
                </div>
            </div>
        </div>
    </div>`


    })

        
    }


    calcularTotal() {
        let total = 0 ;
        this.listaCarrito.forEach(productos => {
            total += productos.precio * productos.cantidad
        })
        return total;

    }

    mostrarTotalEnDOM() {
        this.total.innerHTML = this.calcularTotal()
    
    }
}

//Defino los controlers
const controladorProductos = new ProductosControler()
const controladorCarrito = new CarritoControler()

controladorProductos.levantar_mostrar(controladorCarrito)


controladorCarrito.levantarDeStorage()

//DOM 
controladorCarrito.mostrarEnDOM()
controladorCarrito.mostrarTotalEnDOM()


//Se desarrollan eventos

controladorProductos.darEventoClickProductos()

