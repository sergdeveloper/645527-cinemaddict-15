import Abstract from '../view/abstract';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

const createElement = (template) => {
  const temporalContainer = document.createElement('div');
  temporalContainer.innerHTML = template;

  return temporalContainer.firstChild;
};

const render = (container, element, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export {createElement, render, RenderPosition, remove};