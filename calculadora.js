// ============================================
// CALCULADORA DE HUELLA DE CARBONO - MOVILIDAD
// Rutas Cero Carbono, S.L.
// ============================================

// FACTORES DE EMISIÓN (kg CO2 por km)
// Basados en MITECO (España) y datos IPCC promediados
const factoresEmision = {
  coche_gasolina: 0.192,      // Coche gasolina medio
  coche_diesel: 0.171,        // Coche diésel medio
  coche_hibrido: 0.110,       // Coche híbrido
  coche_electrico: 0.053,     // Coche eléctrico (mix energético español)
  moto: 0.084,                // Motocicleta media
  autobus: 0.089,             // Autobús urbano
  metro: 0.041,               // Metro
  tren_cercanias: 0.035,      // Tren de cercanías
  bicicleta: 0,               // Bicicleta (0 emisiones)
  caminando: 0,               // A pie (0 emisiones)
  patinete_electrico: 0.015   // Patinete eléctrico compartido
};

// ALTERNATIVAS VERDES para cada medio de transporte
const alternativasVerdes = {
  coche_gasolina: {
    medio: "Transporte público (Metro/Tren)",
    reduccion: 0.80,  // 80% reducción
    icono: "🚇"
  },
  coche_diesel: {
    medio: "Transporte público (Metro/Tren)",
    reduccion: 0.79,
    icono: "🚇"
  },
  coche_hibrido: {
    medio: "Bicicleta o transporte público",
    reduccion: 0.63,
    icono: "🚴"
  },
  coche_electrico: {
    medio: "Bicicleta o caminar",
    reduccion: 0.100,
    icono: "🚴"
  },
  moto: {
    medio: "Transporte público o bicicleta",
    reduccion: 0.51,
    icono: "🚇"
  },
  autobus: {
    medio: "Metro o bicicleta",
    reduccion: 0.54,
    icono: "🚇"
  },
  metro: {
    medio: "Bicicleta (si la distancia lo permite)",
    reduccion: 0.100,
    icono: "🚴"
  },
  tren_cercanias: {
    medio: "Bicicleta o caminar",
    reduccion: 0.100,
    icono: "🚴"
  },
  bicicleta: {
    medio: "¡Ya usas la mejor opción!",
    reduccion: 0,
    icono: "✅"
  },
  caminando: {
    medio: "¡Ya usas la mejor opción!",
    reduccion: 0,
    icono: "✅"
  },
  patinete_electrico: {
    medio: "Bicicleta convencional",
    reduccion: 0.100,
    icono: "🚴"
  }
};

// FUNCIÓN PRINCIPAL: Calcular Huella de Carbono
function calcularHuella() {
  // Obtener valores del formulario
  const distancia = parseFloat(document.getElementById('distancia').value);
  const transporte = document.getElementById('transporte').value;
  const diasSemana = parseInt(document.getElementById('dias-semana').value);
  
  // Validación de datos
  if (!distancia || distancia <= 0) {
    mostrarError('Por favor, introduce una distancia válida');
    return;
  }
  
  if (!transporte) {
    mostrarError('Por favor, selecciona un medio de transporte');
    return;
  }
  
  // Calcular emisiones
  const factorEmision = factoresEmision[transporte];
  const emisionDiaria = distancia * 2 * factorEmision; // Ida y vuelta
  const emisionSemanal = emisionDiaria * diasSemana;
  const emisionMensual = emisionSemanal * 4.33; // Promedio semanas/mes
  const emisionAnual = emisionMensual * 12;
  
  // Obtener alternativa verde
  const alternativa = alternativasVerdes[transporte];
  const factorAlternativa = obtenerFactorAlternativa(transporte);
  const ahorroAnual = emisionAnual - (distancia * 2 * factorAlternativa * diasSemana * 4.33 * 12);
  
  // Mostrar resultados
  mostrarResultados({
    distancia,
    transporte,
    diasSemana,
    emisionDiaria,
    emisionSemanal,
    emisionMensual,
    emisionAnual,
    alternativa,
    ahorroAnual
  });
}

// Función auxiliar: Obtener factor de emisión de la alternativa
function obtenerFactorAlternativa(transporteActual) {
  // Si ya es verde, devolver el mismo
  if (transporteActual === 'bicicleta' || transporteActual === 'caminando') {
    return factoresEmision[transporteActual];
  }
  
  // Recomendar metro/tren como alternativa principal
  if (['coche_gasolina', 'coche_diesel', 'moto', 'autobus'].includes(transporteActual)) {
    return factoresEmision.metro;
  }
  
  // Para opciones ya sostenibles, sugerir bicicleta
  return factoresEmision.bicicleta;
}

// Función: Mostrar resultados en el DOM
function mostrarResultados(datos) {
  const resultadosDiv = document.getElementById('resultados');
  const nombreTransporte = obtenerNombreTransporte(datos.transporte);
  
  // Crear HTML de resultados
  resultadosDiv.innerHTML = `
    <div class="resultado-card">
      <h3>📊 Tu Huella de Carbono</h3>
      <div class="resumen">
        <p><strong>Trayecto:</strong> ${datos.distancia} km (ida) × ${datos.diasSemana} días/semana</p>
        <p><strong>Medio de transporte:</strong> ${nombreTransporte}</p>
      </div>
      
      <div class="emisiones">
        <div class="emision-item">
          <span class="label">Emisión Diaria:</span>
          <span class="valor">${datos.emisionDiaria.toFixed(2)} kg CO₂</span>
        </div>
        <div class="emision-item">
          <span class="label">Emisión Semanal:</span>
          <span class="valor">${datos.emisionSemanal.toFixed(2)} kg CO₂</span>
        </div>
        <div class="emision-item destacado">
          <span class="label">Emisión Mensual:</span>
          <span class="valor">${datos.emisionMensual.toFixed(2)} kg CO₂</span>
        </div>
        <div class="emision-item destacado-anual">
          <span class="label">Emisión Anual:</span>
          <span class="valor grande">${datos.emisionAnual.toFixed(2)} kg CO₂</span>
        </div>
      </div>
      
      ${generarComparacion(datos.emisionAnual)}
      
      <div class="alternativa">
        <h4>${datos.alternativa.icono} Alternativa Verde Recomendada</h4>
        <p class="alternativa-texto">${datos.alternativa.medio}</p>
        ${datos.ahorroAnual > 0 ? `
          <div class="ahorro">
            <p>💚 <strong>Ahorro potencial anual:</strong></p>
            <p class="ahorro-valor">${datos.ahorroAnual.toFixed(2)} kg CO₂</p>
            <p class="ahorro-porcentaje">(${(datos.alternativa.reduccion * 100).toFixed(0)}% de reducción)</p>
          </div>
        ` : '<p class="felicitacion">🎉 ¡Felicitaciones! Ya utilizas un medio de transporte sostenible.</p>'}
      </div>
      
      <button onclick="resetCalculadora()" class="btn-reset">🔄 Nueva Consulta</button>
    </div>
  `;
  
  // Mostrar resultados con animación
  resultadosDiv.style.display = 'block';
  resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Función: Generar comparación visual de emisiones
function generarComparacion(emisionAnual) {
  const arboles = (emisionAnual / 21).toFixed(1); // Un árbol absorbe ~21 kg CO2/año
  const kmCoche = (emisionAnual / 0.192).toFixed(0); // Equivalente en km de coche gasolina
  
  return `
    <div class="comparacion">
      <h4>🌍 ¿Qué significa esto?</h4>
      <p>🌳 Necesitarías <strong>${arboles} árboles</strong> plantados para compensar tu huella anual</p>
      <p>🚗 Equivale a conducir <strong>${kmCoche} km</strong> en un coche de gasolina</p>
    </div>
  `;
}

// Función: Obtener nombre legible del transporte
function obtenerNombreTransporte(codigo) {
  const nombres = {
    coche_gasolina: 'Coche gasolina',
    coche_diesel: 'Coche diésel',
    coche_hibrido: 'Coche híbrido',
    coche_electrico: 'Coche eléctrico',
    moto: 'Motocicleta',
    autobus: 'Autobús',
    metro: 'Metro',
    tren_cercanias: 'Tren de cercanías',
    bicicleta: 'Bicicleta',
    caminando: 'A pie',
    patinete_electrico: 'Patinete eléctrico'
  };
  return nombres[codigo] || codigo;
}

// Función: Mostrar mensajes de error
function mostrarError(mensaje) {
  const resultadosDiv = document.getElementById('resultados');
  resultadosDiv.innerHTML = `
    <div class="error-message">
      <p>⚠️ ${mensaje}</p>
    </div>
  `;
  resultadosDiv.style.display = 'block';
}

// Función: Resetear calculadora
function resetCalculadora() {
  document.getElementById('calculadora-form').reset();
  document.getElementById('resultados').style.display = 'none';
  document.getElementById('resultados').innerHTML = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Listener para el botón de calcular
  const btnCalcular = document.getElementById('btn-calcular');
  if (btnCalcular) {
    btnCalcular.addEventListener('click', function(e) {
      e.preventDefault();
      calcularHuella();
    });
  }
  
  // Listener para Enter en los campos
  const form = document.getElementById('calculadora-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      calcularHuella();
    });
  }
  
  // Listener para cambios en el selector de transporte (opcional: mostrar info)
  const selectTransporte = document.getElementById('transporte');
  if (selectTransporte) {
    selectTransporte.addEventListener('change', function() {
      const info = document.getElementById('info-transporte');
      if (info && this.value) {
        const factor = factoresEmision[this.value];
        info.innerHTML = `<small>Factor de emisión: ${factor} kg CO₂/km</small>`;
        info.style.display = 'block';
      }
    });
  }
});

// Función adicional: Exportar resultados (opcional)
function exportarResultados() {
  // Esta función podría implementarse para exportar a PDF o CSV
  alert('Función de exportación en desarrollo');
}

// Función adicional: Compartir en redes sociales (opcional)
function compartirResultados(emisionAnual) {
  const texto = `Mi huella de carbono anual por desplazamientos es de ${emisionAnual.toFixed(2)} kg CO₂. ¿Y la tuya? Calcula tu impacto con Rutas Cero Carbono.`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Mi Huella de Carbono',
      text: texto,
      url: window.location.href
    });
  } else {
    // Fallback: copiar al portapapeles
    navigator.clipboard.writeText(texto);
    alert('Texto copiado al portapapeles');
  }
}