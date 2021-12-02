import { PortalLayersService } from './portal-layers.service';
import { TestBed } from '@angular/core/testing';
import { PortalLayer } from '../../declarations/interfaces/portal-layer.interface';
import { getUuid } from '@bimeister/utilities';

class TestLayer implements PortalLayer {
  public readonly id: string = getUuid();
  private zIndex: number = 0;

  constructor(public readonly index: number) {}

  public getCurrentZIndex(): number {
    return this.zIndex;
  }

  public moveToZIndex(zIndex: number): void {
    this.zIndex = zIndex;
  }
}

const LAYER_MOCKS: PortalLayer[] = new Array(5).fill(null).map((_: null, index: number) => new TestLayer(index));

describe('portal-layers.service.ts', () => {
  let service: PortalLayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortalLayersService],
    });

    service = TestBed.inject(PortalLayersService);
  });

  it('should define service', () => {
    expect(service).toBeDefined();
  });

  it('should get null from getTopLayer by default', () => {
    expect(service.getTopLayer()).toBeNull();
  });

  it('should get null from getLayerById by default', () => {
    expect(service.getLayerById('some-id')).toBeNull();
  });

  it('should get empty array from getLayersFromTopToBottom by default', () => {
    expect(service.getLayersFromTopToBottom()).toEqual([]);
  });

  it('should do nothing for calling removeById with invalid id', () => {
    service.removeById('some-id');
    expect(service.getLayersFromTopToBottom()).toEqual([]);
  });

  it('should do nothing for calling moveToTopById with invalid id', () => {
    service.moveToTopById('some-id');
    expect(service.getLayersFromTopToBottom()).toEqual([]);
  });

  it('should register and get by id layer', () => {
    service.register(LAYER_MOCKS[0]);
    expect(service.getLayerById(LAYER_MOCKS[0].id)).toBe(LAYER_MOCKS[0]);
    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(0);
  });

  it('should register and move to top layer', () => {
    service.register(LAYER_MOCKS[0]);
    service.moveToTopById(LAYER_MOCKS[0].id);
    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(1000);
  });

  it('should register and move to top all layers', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
      service.moveToTopById(layer.id);
    }

    expect(service.getTopLayer()).toBe(LAYER_MOCKS[4]);
    expect(service.getLayersFromTopToBottom()).toEqual([
      LAYER_MOCKS[4],
      LAYER_MOCKS[3],
      LAYER_MOCKS[2],
      LAYER_MOCKS[1],
      LAYER_MOCKS[0],
    ]);

    expect(LAYER_MOCKS[4].getCurrentZIndex()).toBe(1004);
    expect(LAYER_MOCKS[3].getCurrentZIndex()).toBe(1003);
    expect(LAYER_MOCKS[2].getCurrentZIndex()).toBe(1002);
    expect(LAYER_MOCKS[1].getCurrentZIndex()).toBe(1001);
    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(1000);
  });

  it('should register and move to top all layers and move second layer to top after', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
      service.moveToTopById(layer.id);
    }

    service.moveToTopById(LAYER_MOCKS[1].id);

    expect(service.getTopLayer()).toBe(LAYER_MOCKS[1]);
    expect(service.getLayersFromTopToBottom()).toEqual([
      LAYER_MOCKS[1],
      LAYER_MOCKS[4],
      LAYER_MOCKS[3],
      LAYER_MOCKS[2],
      LAYER_MOCKS[0],
    ]);

    expect(LAYER_MOCKS[1].getCurrentZIndex()).toBe(1005);
    expect(LAYER_MOCKS[4].getCurrentZIndex()).toBe(1004);
    expect(LAYER_MOCKS[3].getCurrentZIndex()).toBe(1003);
    expect(LAYER_MOCKS[2].getCurrentZIndex()).toBe(1002);
    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(1000);
  });

  it('should register and move to top all layers and move first layer to top after', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
      service.moveToTopById(layer.id);
    }

    service.moveToTopById(LAYER_MOCKS[0].id);

    expect(service.getTopLayer()).toBe(LAYER_MOCKS[0]);
    expect(service.getLayersFromTopToBottom()).toEqual([
      LAYER_MOCKS[0],
      LAYER_MOCKS[4],
      LAYER_MOCKS[3],
      LAYER_MOCKS[2],
      LAYER_MOCKS[1],
    ]);

    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(1005);
    expect(LAYER_MOCKS[4].getCurrentZIndex()).toBe(1004);
    expect(LAYER_MOCKS[3].getCurrentZIndex()).toBe(1003);
    expect(LAYER_MOCKS[2].getCurrentZIndex()).toBe(1002);
    expect(LAYER_MOCKS[1].getCurrentZIndex()).toBe(1001);
  });

  it('should register and move to top all layers and move last layer to top after', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
      service.moveToTopById(layer.id);
    }

    service.moveToTopById(LAYER_MOCKS[4].id);

    expect(service.getTopLayer()).toBe(LAYER_MOCKS[4]);
    expect(service.getLayersFromTopToBottom()).toEqual([
      LAYER_MOCKS[4],
      LAYER_MOCKS[3],
      LAYER_MOCKS[2],
      LAYER_MOCKS[1],
      LAYER_MOCKS[0],
    ]);

    expect(LAYER_MOCKS[4].getCurrentZIndex()).toBe(1004);
    expect(LAYER_MOCKS[3].getCurrentZIndex()).toBe(1003);
    expect(LAYER_MOCKS[2].getCurrentZIndex()).toBe(1002);
    expect(LAYER_MOCKS[1].getCurrentZIndex()).toBe(1001);
    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(1000);
  });

  it('should register and move to top all layers and remove second layer after', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
      service.moveToTopById(layer.id);
    }

    service.removeById(LAYER_MOCKS[1].id);
    expect(service.getLayerById(LAYER_MOCKS[1].id)).toBeNull();

    expect(service.getTopLayer()).toBe(LAYER_MOCKS[4]);
    expect(service.getLayersFromTopToBottom()).toEqual([
      LAYER_MOCKS[4],
      LAYER_MOCKS[3],
      LAYER_MOCKS[2],
      LAYER_MOCKS[0],
    ]);

    expect(LAYER_MOCKS[4].getCurrentZIndex()).toBe(1004);
    expect(LAYER_MOCKS[3].getCurrentZIndex()).toBe(1003);
    expect(LAYER_MOCKS[2].getCurrentZIndex()).toBe(1002);
    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(1000);
  });

  it('should register and move to top all layers and remove second and fourth layers after', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
      service.moveToTopById(layer.id);
    }

    service.removeById(LAYER_MOCKS[1].id);
    service.removeById(LAYER_MOCKS[3].id);

    expect(service.getLayerById(LAYER_MOCKS[1].id)).toBeNull();
    expect(service.getLayerById(LAYER_MOCKS[3].id)).toBeNull();

    expect(service.getTopLayer()).toBe(LAYER_MOCKS[4]);
    expect(service.getLayersFromTopToBottom()).toEqual([LAYER_MOCKS[4], LAYER_MOCKS[2], LAYER_MOCKS[0]]);

    expect(LAYER_MOCKS[4].getCurrentZIndex()).toBe(1004);
    expect(LAYER_MOCKS[2].getCurrentZIndex()).toBe(1002);
    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(1000);
  });

  it('should register and move to top all layers and remove first and last layers after', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
      service.moveToTopById(layer.id);
    }

    service.removeById(LAYER_MOCKS[0].id);
    service.removeById(LAYER_MOCKS[4].id);

    expect(service.getLayerById(LAYER_MOCKS[0].id)).toBeNull();
    expect(service.getLayerById(LAYER_MOCKS[4].id)).toBeNull();

    expect(service.getTopLayer()).toBe(LAYER_MOCKS[3]);
    expect(service.getLayersFromTopToBottom()).toEqual([LAYER_MOCKS[3], LAYER_MOCKS[2], LAYER_MOCKS[1]]);

    expect(LAYER_MOCKS[3].getCurrentZIndex()).toBe(1003);
    expect(LAYER_MOCKS[2].getCurrentZIndex()).toBe(1002);
    expect(LAYER_MOCKS[1].getCurrentZIndex()).toBe(1001);
  });

  it('should register and move to top all layers and chagge layer levels after', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
      service.moveToTopById(layer.id);
    }

    service.moveToTopById(LAYER_MOCKS[4].id);
    service.moveToTopById(LAYER_MOCKS[2].id);
    service.moveToTopById(LAYER_MOCKS[4].id);
    service.moveToTopById(LAYER_MOCKS[1].id);
    service.moveToTopById(LAYER_MOCKS[0].id);

    expect(service.getTopLayer()).toBe(LAYER_MOCKS[0]);
    expect(service.getLayersFromTopToBottom()).toEqual([
      LAYER_MOCKS[0],
      LAYER_MOCKS[1],
      LAYER_MOCKS[4],
      LAYER_MOCKS[2],
      LAYER_MOCKS[3],
    ]);

    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(1008);
    expect(LAYER_MOCKS[1].getCurrentZIndex()).toBe(1007);
    expect(LAYER_MOCKS[4].getCurrentZIndex()).toBe(1006);
    expect(LAYER_MOCKS[2].getCurrentZIndex()).toBe(1005);
    expect(LAYER_MOCKS[3].getCurrentZIndex()).toBe(1003);
  });

  it('should register and move to top all layers, chagge layer levels and remove all layers after', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
      service.moveToTopById(layer.id);
    }

    service.moveToTopById(LAYER_MOCKS[4].id);
    service.moveToTopById(LAYER_MOCKS[2].id);
    service.moveToTopById(LAYER_MOCKS[4].id);
    service.moveToTopById(LAYER_MOCKS[1].id);
    service.moveToTopById(LAYER_MOCKS[0].id);

    service.removeById(LAYER_MOCKS[0].id);
    service.removeById(LAYER_MOCKS[1].id);
    service.removeById(LAYER_MOCKS[2].id);
    service.removeById(LAYER_MOCKS[3].id);
    service.removeById(LAYER_MOCKS[4].id);

    expect(service.getLayersFromTopToBottom()).toEqual([]);
    expect(service.getTopLayer()).toEqual(null);
  });

  it('should normalize z-indexes after 1000 moving', () => {
    for (const layer of LAYER_MOCKS) {
      service.register(layer);
    }

    const itemsCount: number = LAYER_MOCKS.length;
    new Array(1000).fill(null).forEach((_: null, index: number) => {
      const layerIndex: number = index - itemsCount * Math.floor(index / itemsCount);
      service.moveToTopById(LAYER_MOCKS[layerIndex].id);
    });

    expect(service.getTopLayer()).toBe(LAYER_MOCKS[4]);
    expect(service.getLayersFromTopToBottom()).toEqual([
      LAYER_MOCKS[4],
      LAYER_MOCKS[3],
      LAYER_MOCKS[2],
      LAYER_MOCKS[1],
      LAYER_MOCKS[0],
    ]);

    expect(LAYER_MOCKS[4].getCurrentZIndex()).toBe(1004);
    expect(LAYER_MOCKS[3].getCurrentZIndex()).toBe(1003);
    expect(LAYER_MOCKS[2].getCurrentZIndex()).toBe(1002);
    expect(LAYER_MOCKS[1].getCurrentZIndex()).toBe(1001);
    expect(LAYER_MOCKS[0].getCurrentZIndex()).toBe(1000);
  });
});
