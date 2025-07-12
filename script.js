
    // Função que formata números com dois dígitos
    function formatTime(number) {
      return number < 10 ? '0' + number : number;
    }

    // Função principal do relógio
    function showTime() {
      const now = new Date(); // Pega a hora atual
      const hours = formatTime(now.getHours());   // Horas formatadas
      const minutes = formatTime(now.getMinutes()); // Minutos formatados
      const seconds = formatTime(now.getSeconds()); // Segundos formatados

      const currentTime = `${hours}:${minutes}:${seconds}`; // Monta o texto
      document.getElementById('clock').textContent = currentTime; // Atualiza na tela

      // Data
    
    const day = formatTime(now.getDate());
    const month = formatTime(now.getMonth() + 1); // Mês começa em 0
    const year = now.getFullYear();
    
    const fullDate = `${day}/${month}/${year}`;

    document.getElementById('date').textContent = fullDate;
    }

   

    setInterval(showTime, 1000); // Atualiza o relógio a cada segundo
    showTime(); // Chama a função uma vez ao iniciar