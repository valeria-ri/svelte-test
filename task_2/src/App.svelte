<script lang="ts">
  import { onMount } from "svelte";

  const key: string = "e0304165b5989eb12ecbd489"; // по-хорошему это надо спрятать куда-нибудь в env :)

  const number1name: string = "value1";
  const number2name: string = "value2";
  const currency1name: string = "currency1";
  const currency2name: string = "currency2";

  let currency1: string = "RUB";
  let currency2: string = "USD";
  let value1: number = 1;
  let value2: number;
  let supportedCurrencies: string[] = [];

  // рендеринг списка доступных валют и исходных значений
  // ПЛАНИРУЮ РЕАЛИЗОВАТЬ кэширование для экономии запросов
  // дописать обработку ошибок
  onMount(async () => {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${key}/codes`,
      );
    const data = await res.json();
    supportedCurrencies = await data.supported_codes;
    initConversion();
  });

  // запрос курса валют
  // ПЛАНИРУЮ РЕАЛИЗОВАТЬ кэширование для экономии запросов
  // дописать обработку ошибок
  async function getCurrencyData(baseCurrency: string, targetCurrency: string) {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${key}/pair/${baseCurrency}/${targetCurrency}`,
    );
    const data = await res.json();
    return await parseFloat(data.conversion_rate.toFixed(4));
  };

  // конвертация
  async function convert(baseCurrency: string, targetCurrency: string, value: number): Promise<number> {
    const converted = await getCurrencyData(baseCurrency, targetCurrency);
    return value * converted;
  };

  // изначальная конвертация для первого рендеринга страницы
  function initConversion() {
    convert(currency1, currency2, value1).then((res) => (value2 = res));
  };

  // обработчик изменения числовых значений
  function changeValues(event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value) || 0;
    const name = (event.target as HTMLInputElement).name;

    if (name === number1name) {
      convert(currency1, currency2, value).then((res) => (value2 = res));
    }
    if (name === number2name) {
      convert(currency2, currency1, value).then((res) => (value1 = res));
    }
  };

  // обработчик изменения валют (первая остается ведущей)
  function changeCurrencies(event: Event) {
    const { value, name } = event.target as HTMLInputElement;
    if (name === currency1name) {
      convert(value, currency2, value1).then((res) => (value2 = res));
    }
    if (name === currency2name) {
      convert(currency1, value, value1).then((res) => (value2 = res));
    }
  };
</script>

<main class="page">
  <h1 class="title">Currency converter</h1>
  <section class="converter">
    <fieldset class="converter__field">
      <input
        class="converter__input"
        type="number"
        name={number1name}
        bind:value={value1}
        on:input={changeValues}
        min="0"
      />
      <select
        class="converter__select"
        name={currency1name}
        bind:value={currency1}
        on:change={changeCurrencies}
      >
        {#each supportedCurrencies as currency}
          <option value={currency[0]}>
            {currency[1]}
          </option>
        {/each}
      </select>
    </fieldset>
    <fieldset class="converter__field">
      <input
        class="converter__input"
        type="number"
        name={number2name}
        bind:value={value2}
        on:input={changeValues}
        min="0"
      />
      <select
        class="converter__select"
        name={currency2name}
        bind:value={currency2}
        on:change={changeCurrencies}
      >
        {#each supportedCurrencies as currency}
          <option value={currency[0]}>
            {currency[1]}
          </option>
        {/each}
      </select>
    </fieldset>
  </section>
</main>
